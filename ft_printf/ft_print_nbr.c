/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_print_nbr.c                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtahayne <mtahayne@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/10/08 14:40:00 by mtahayne          #+#    #+#             */
/*   Updated: 2026/10/08 14:40:00 by mtahayne         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"

int	ft_print_nbr(int n)
{
	long	num;
	int		count;
	int		res;

	num = n;
	count = 0;
	if (num < 0)
	{
		if (write(1, "-", 1) == -1)
			return (-1);
		count++;
		num = -num;
	}
	if (num >= 10)
	{
		res = ft_print_nbr(num / 10);
		if (res == -1)
			return (-1);
		count += res;
	}
	if (write(1, &"0123456789"[num % 10], 1) == -1)
		return (-1);
	count++;
	return (count);
}

int	ft_print_unsigned(unsigned int n)
{
	int	count;
	int	res;

	count = 0;
	if (n >= 10)
	{
		res = ft_print_unsigned(n / 10);
		if (res == -1)
			return (-1);
		count += res;
	}
	if (write(1, &"0123456789"[n % 10], 1) == -1)
		return (-1);
	count++;
	return (count);
}
