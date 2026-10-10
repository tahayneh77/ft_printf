/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_print_ptr.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtahayne <mtahayne@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/10/08 14:40:00 by mtahayne          #+#    #+#             */
/*   Updated: 2026/10/08 14:40:00 by mtahayne         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"

static int	ft_ptr_hex(unsigned long n)
{
	int		count;
	int		res;
	char	*base;

	base = "0123456789abcdef";
	count = 0;
	if (n >= 16)
	{
		res = ft_ptr_hex(n / 16);
		if (res == -1)
			return (-1);
		count += res;
	}
	if (write(1, &base[n % 16], 1) == -1)
		return (-1);
	count++;
	return (count);
}

int	ft_print_ptr(void *ptr)
{
	unsigned long	addr;
	int				count;
	int				res;

	if (!ptr)
		return (write(1, "(nil)", 5));
	addr = (unsigned long)ptr;
	if (write(1, "0x", 2) == -1)
		return (-1);
	count = 2;
	res = ft_ptr_hex(addr);
	if (res == -1)
		return (-1);
	count += res;
	return (count);
}
